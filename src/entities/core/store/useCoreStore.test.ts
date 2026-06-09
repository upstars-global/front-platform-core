import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCoreStore } from './useCoreStore';
import type { IRegionResource } from '../api/types';

describe('useCoreStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mockRegionsA: IRegionResource[] = [
    { code: 'AA-01', fullName: 'Region Alpha 1' },
    { code: 'AA-02', fullName: 'Region Alpha 2' },
  ];

  const mockRegionsB: IRegionResource[] = [
    { code: 'BB-01', fullName: 'Region Beta 1' },
  ];

  it('should initialize with an empty regions object', () => {
    const store = useCoreStore();
    expect(store.regionsByCountry).toEqual({});
  });

  it('should set and get regions for a specific country code', () => {
    const store = useCoreStore();
    
    store.setRegions('AA', mockRegionsA);
    
    expect(store.getRegions('AA')).toEqual(mockRegionsA);
    expect(store.regionsByCountry['AA']).toEqual(mockRegionsA);
  });

  it('should return undefined when getting regions for an unknown country code', () => {
    const store = useCoreStore();
    
    expect(store.getRegions('XX')).toBeUndefined();
  });

  it('should clear regions for a specific country code', () => {
    const store = useCoreStore();
    
    store.setRegions('AA', mockRegionsA);
    store.setRegions('BB', mockRegionsB);
    
    store.clearRegions('AA');
    
    expect(store.getRegions('AA')).toBeUndefined();
    expect(store.getRegions('BB')).toEqual(mockRegionsB);
    expect(store.regionsByCountry).toHaveProperty('BB');
    expect(store.regionsByCountry).not.toHaveProperty('AA');
  });

  it('should clear all regions when no country code is provided', () => {
    const store = useCoreStore();
    
    store.setRegions('AA', mockRegionsA);
    store.setRegions('BB', mockRegionsB);
    
    store.clearRegions();
    
    expect(store.getRegions('AA')).toBeUndefined();
    expect(store.getRegions('BB')).toBeUndefined();
    expect(store.regionsByCountry).toEqual({});
  });
});