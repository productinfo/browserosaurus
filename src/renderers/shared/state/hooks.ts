import deepEqual from 'fast-deep-equal'
import type { TypedUseSelectorHook } from 'react-redux'
import { shallowEqual, useSelector as useReduxSelector } from 'react-redux'

import type { AppId, Apps } from '../../../config/apps'
import { apps as allApps } from '../../../config/apps'
import type { RootState } from '../../../shared/state/reducer.root'

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector

export const useShallowEqualSelector: TypedUseSelectorHook<RootState> = (
  selector,
) => useSelector(selector, shallowEqual)

export const useDeepEqualSelector: TypedUseSelectorHook<RootState> = (
  selector,
) => useSelector(selector, deepEqual)

export interface InstalledApp {
  id: AppId
  name: Apps[AppId]['name']
  hotkey: string | null
  hotCode: string | null
}

export const useInstalledApps = (): InstalledApp[] => {
  const storedApps = useDeepEqualSelector((state) => state.storage.apps)
  const installedApps = useDeepEqualSelector(
    (state) => state.data.installedApps,
  )
  return storedApps
    .filter((storedApp) => installedApps.includes(storedApp.id))
    .map((storedApp) => ({
      id: storedApp.id,
      hotkey: storedApp.hotkey,
      hotCode: storedApp.hotCode,
      name: allApps[storedApp.id].name,
    }))
}

export const useIsSupportMessageHidden = (): boolean => {
  const supportMessageNumber = useSelector(
    (state) => state.storage.supportMessage,
  )

  const ONE_WEEK = 604_800_000

  return (
    // Hidden by user
    supportMessageNumber === -1 ||
    // Snoozing
    supportMessageNumber > Date.now() - ONE_WEEK
  )
}

export const useKeyCodeMap = (): Record<string, string> =>
  useShallowEqualSelector((state) => state.data.keyCodeMap)