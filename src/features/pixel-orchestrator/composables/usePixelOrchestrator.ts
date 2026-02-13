import { onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { authEvents } from "../../../entities/auth";
import { TransactionType, type TransactionHistoryItemResource } from "../../../entities/cashbox";
import { useShowClientNotification } from "../../../entities/clientNotifications";
import { useEnvironmentStore } from "../../../entities/environment";
import { useMultiLangStore } from "../../../entities/multilang";
import { pixelOrchestratorEvents, type BaseDepositParams, PixelOrchestratorEventsEnum } from '../../../entities/pixel-orchestrator';
import { useUserProfileStore } from "../../../entities/user";
import { log, Currency } from '../../../shared';
import { useCashboxLoad, useTransactions, useTransactionsStore } from "../../cashbox";
import { userBalanceWebsocketsEmitter, UserBalanceWebsocketTypes } from "../../user";
import { isGeoAllowedForDepositPixels } from "../config";
import type { PixelConfigMap } from '../types';

const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;

// Release date for BE-based pixel tracking (Unix timestamp in milliseconds)
// Only process deposits created after this date for backward compatibility
const RELEASE_DATE = new Date("2026-01-14T00:00:00Z").getTime(); // TODO: Update with actual release date

/**
 * Module-level state to ensure singleton behavior across multiple component instances
 *
 * IMPORTANT: These variables are shared across ALL calls to usePixelOrchestrator()
 * This ensures that:
 * 1. Event listeners (login, visibility) are only attached once, even if the composable
 *    is called in multiple components
 * 2. Only one deposit processing operation runs at a time across all instances
 * 3. Prevents duplicate pixel firing when multiple components use this composable
 *
 * Example: If Component A and Component B both call usePixelOrchestrator(), and a login
 * event fires, only ONE instance will process deposits due to the shared isProcessing flag.
 */
let visibilityListenerAttached = false;
let loginListenerAttached = false;
let depositSocketListenerAttached = false;
let isProcessing = false;
let hasMounted = false;

/**
 * Creates a unique notification ID for a deposit transaction
 */
function createNotificationIdForDepositTransactionId(transactionId: string): string {
  return `deposit-pixel-${transactionId}`;
}

export function usePixelOrchestrator<T = unknown>(...configs: PixelConfigMap<T>[]) {
  const { isMockerMode } = storeToRefs(useEnvironmentStore());

  if (isMockerMode.value) {
    return {
      emitVisitViaPixelAnalytic: () => {},
      emitRegistrationViaPixelAnalytic: () => {},
      logDepositViaPixelAnalytic: async () => {},
      initPixelDepositProcessor: async () => {},
      processUntrackedDeposits: async () => {},
    };
  }

  const multiLangStore = useMultiLangStore();
  const userProfileStore = useUserProfileStore();
  const transactionsStore = useTransactionsStore();
  const { loadAllTransactionsHistory, loadNextPageTransactionHistoryByType, MAX_TRANSACTIONS_PER_PAGE } =
    useTransactions();
  const { showClientNotification } = useShowClientNotification();
  const { loadUserDepositNumbers } = useCashboxLoad();

  function emitVisitViaPixelAnalytic() {
    pixelOrchestratorEvents.emit(PixelOrchestratorEventsEnum.VISIT);
  }

  function emitRegistrationViaPixelAnalytic() {
    pixelOrchestratorEvents.emit(PixelOrchestratorEventsEnum.REGISTRATION, userProfileStore.userId);
  }

  function emitFirstDepositViaPixelAnalytic(params: BaseDepositParams) {
    pixelOrchestratorEvents.emit(PixelOrchestratorEventsEnum.FIRST_DEPOSIT, params);
  }

  function emitNotFirstDepositViaPixelAnalytic(params: BaseDepositParams) {
    pixelOrchestratorEvents.emit(PixelOrchestratorEventsEnum.DEPOSIT, params);
  }

  /**
   * Called when websocket.treasury.event.transaction.confirmed is received
   * Triggers deposit pixel processing
   */
  async function logDepositViaPixelAnalytic() {
    // Trigger processing of all untracked deposits
    await processUntrackedDeposits();
  }

  /**
   * Check if transaction has already been tracked via BE notification system
   */
  async function isTransactionTracked(transactionId: string): Promise<boolean> {
    // This method check if transaction has already been tracked and anyway run side effect to mark it as tracked.
    return await showClientNotification(createNotificationIdForDepositTransactionId(transactionId));
  }

  /**
   * Check if transaction is within last 2 days AND after the release date
   * For backward compatibility, only process deposits created after release date
   */
  function isTransactionRecent(transaction: TransactionHistoryItemResource): boolean {
    const now = Date.now();
    const twoDaysAgo = now - TWO_DAYS_IN_MS;
    const timestampConvertedInMilliseconds = transaction.createdAt * 1000;

    // Must be within last 2 days AND after release date
    return timestampConvertedInMilliseconds >= twoDaysAgo && timestampConvertedInMilliseconds >= RELEASE_DATE;
  }

  function isTransactionSuccessful(transaction: TransactionHistoryItemResource): boolean {
    return transaction.status === 'success';
  }

  /**
   * Determine if we should stop fetching next page
   * Stop when we find a transaction that is either old or already tracked
   */
  async function shouldStopFetchingNextPage(transaction: TransactionHistoryItemResource): Promise<boolean> {
    if (!isTransactionRecent(transaction)) {
      return true;
    }
    return await isTransactionTracked(transaction.id);
  }

  /**
   * Recursively fetch deposit transactions until stop criteria is met
   */
  async function fetchUntrackedDeposits(
    data: TransactionHistoryItemResource[],
    currentPage: number = 1,
  ): Promise<TransactionHistoryItemResource[]> {
    const untrackedDeposits: TransactionHistoryItemResource[] = [];
    let shouldContinue = true;

    for (const transaction of data) {
      if (!isTransactionSuccessful(transaction)) {
        // not successful transactions are not in scope, so skip it
        continue;
      }
      if (await shouldStopFetchingNextPage(transaction)) {
        shouldContinue = false;
        break;
      }

      untrackedDeposits.push(transaction);
    }

    // If all transactions in current page met the criteria and page is full, fetch next page
    if (shouldContinue && data.length === MAX_TRANSACTIONS_PER_PAGE) {
      const prevDataLength = transactionsStore.depositHistory.data.length;

      await loadNextPageTransactionHistoryByType(TransactionType.DEPOSIT);
      // Extract only the newly fetched items
      const newDataLength = transactionsStore.depositHistory.data.length;
      if (newDataLength > prevDataLength) {
        const newItems = transactionsStore.depositHistory.data.slice(prevDataLength);
        if (newItems.length > 0) {
          const nextPageUntracked = await fetchUntrackedDeposits(newItems, currentPage + 1);
          untrackedDeposits.push(...nextPageUntracked);
        }
      }
    }

    return untrackedDeposits;
  }

  async function fireDepositPixel(transaction: TransactionHistoryItemResource, isFirstDeposit = false): Promise<void> {
    try {
      const depositParams: BaseDepositParams = {
        userId: userProfileStore.userId,
        transactionId: transaction.id,
        currency: transaction.currency as Currency,
        amount: 0, // requirement: 0 for all deposits
      };
      // Fire appropriate pixel based on deposit count
      if (isFirstDeposit) {
        emitFirstDepositViaPixelAnalytic(depositParams);
      } else {
        emitNotFirstDepositViaPixelAnalytic(depositParams);
      }

      // Mark as tracked in BE
      await showClientNotification(createNotificationIdForDepositTransactionId(transaction.id));
    } catch (error) {
      log.error('PIXEL_DEPOSIT_FIRE_FAILED', {
        transactionId: transaction.id,
        error,
      });
    }
  }

  /**
   * Main function to process all untracked deposits
   * Triggers: app init, login, tab becomes active, websocket message
   * Module-level isProcessing ensures only one processing across all component instances
   */
  async function processUntrackedDeposits(): Promise<void> {
    if (isProcessing || !userProfileStore.isLogged) {
      return;
    }

    // Early exit if user's geo is not allowed for any deposit pixel
    if (!isGeoAllowedForDepositPixels(multiLangStore.userGeo, ...configs)) {
      return;
    }

    isProcessing = true;

    try {
      const [transactionsHistory, userDepositNumbers] = await Promise.all([
        loadAllTransactionsHistory(),
        loadUserDepositNumbers(),
      ]);
      const { depositHistory } = transactionsHistory;
      if (!depositHistory.total) {
        return;
      }

      // Recursively fetch all untracked deposits
      const untrackedDeposits = await fetchUntrackedDeposits(depositHistory.data);
      const hasFirstDepositInList = userDepositNumbers === untrackedDeposits.length;
      // Fire pixels for all untracked deposits
      if (untrackedDeposits.length > 0) {
        const promises = [...untrackedDeposits].map((deposit, index) => {
          // Assuming BE will return sorted list newest => oldest
          return fireDepositPixel(deposit, hasFirstDepositInList && untrackedDeposits.length - 1 === index);
        });

        await Promise.allSettled(promises);
      }
    } catch (error) {
      log.error('PIXEL_PROCESS_UNTRACKED_DEPOSITS_FAILED', error);
    } finally {
      isProcessing = false;
    }
  }

  /**
   * Initialize pixel deposit processor
   * Sets up triggers for processing untracked deposits
   */
  async function initPixelDepositProcessor(): Promise<void> {
    // Trigger 1: App init (if already logged in)
    if (userProfileStore.isLogged) {
      await processUntrackedDeposits();
    }

    // Trigger 2: Tab becomes active
    if (!visibilityListenerAttached) {
      visibilityListenerAttached = true;

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          processUntrackedDeposits();
        }
      });
    }

    // Trigger 3: Login action
    if (!loginListenerAttached) {
      loginListenerAttached = true;

      authEvents.on('login', () => {
        processUntrackedDeposits();
      });
    }

    // Trigger 4: Deposit approved ws message
    if (!depositSocketListenerAttached) {
      depositSocketListenerAttached = true;
      userBalanceWebsocketsEmitter.on(UserBalanceWebsocketTypes.TRANSACTION_CONFIRMED, logDepositViaPixelAnalytic);
    }
  }

  onMounted(async () => {
    if (hasMounted) {
      return;
    }
    emitVisitViaPixelAnalytic();
    await initPixelDepositProcessor();
    hasMounted = true;
  });

  onUnmounted(() => {
    userBalanceWebsocketsEmitter.off(UserBalanceWebsocketTypes.TRANSACTION_CONFIRMED, logDepositViaPixelAnalytic);
  });

  return {
    emitVisitViaPixelAnalytic,
    emitRegistrationViaPixelAnalytic,
    logDepositViaPixelAnalytic,
    initPixelDepositProcessor,
    processUntrackedDeposits,
  };
}
