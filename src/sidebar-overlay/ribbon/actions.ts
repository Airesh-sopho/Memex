import { createAction } from 'redux-act'

import { Thunk } from '../types'
import * as selectors from './selectors'
import { getSidebarState, setSidebarState } from '../utils'
import { getTooltipState, setTooltipState } from '../../content-tooltip/utils'

export const expandRibbon = createAction('expandRibbon')

export const shrinkRibbon = createAction('shrinkRibbon')

export const setRibbonEnabled = createAction<boolean>('setRibbonEnabled')

export const setTooltipEnabled = createAction<boolean>('setTooltipEnabled')

/**
 * Hydrates the initial state of the ribbon.
 */
export const initState: () => Thunk = () => async dispatch => {
    const isRibbonEnabled = await getSidebarState()
    const isTooltipEnabled = await getTooltipState()

    dispatch(setRibbonEnabled(isRibbonEnabled))
    dispatch(setTooltipEnabled(isTooltipEnabled))
}

export const toggleRibbon: () => Thunk = () => async (dispatch, getState) => {
    const isRibbonEnabled = selectors.isRibbonEnabled(getState())

    dispatch(setRibbonEnabled(!isRibbonEnabled))

    // TODO: Delete the following `setSidebarState` call and let the content
    // script manage it, along with the need to setting the `manualOverride`
    // flag to true.
    await setSidebarState(!isRibbonEnabled)
}

export const toggleTooltip: () => Thunk = () => async (dispatch, getState) => {
    const isTooltipEnabled = selectors.isTooltipEnabled(getState())

    dispatch(setTooltipEnabled(!isTooltipEnabled))

    // TODO: Delete the following `setTooltipState` call and let the content
    // script manage it, along with the need to setting the `manualOverride`
    // flag to true.
    await setTooltipState(!isTooltipEnabled)
}