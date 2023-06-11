import { useContext } from 'react';
import { ServiceIdentifier } from 'vscf/platform/instantiation/common';
import { MemotalkContext } from '../context';

export function useService<T>(id: ServiceIdentifier<T>): T {
  const context = useContext(MemotalkContext);

  const service = context?.instantiationService.invokeFunction((o) =>
    o.get(id)
  );
  if (!service) {
    throw new Error(`Service ${id} not found`);
  }
  return service;
}
