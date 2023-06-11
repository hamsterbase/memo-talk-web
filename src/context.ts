import React from 'react';
import { IInstantiationService } from 'vscf/platform/instantiation/common';

export interface MemotalkContextValue {
  instantiationService: IInstantiationService;
}

export const MemotalkContext = React.createContext<MemotalkContextValue | null>(
  null
);
