// Use these keys in case of action buttons, import the keys in the storage-keys-notif module
import * as storageKeys from './storage-keys-notif'
import * as actionTypes from './action-types'

import { NotifDefinition } from './types'

/** Time when create the notif, get the current unix time (Date.now()) - Important, the notif insertation in db depends on it */
export const releaseTime: number = 1542240979258

/* Example Notification:
{
        id: 'direct_links_inital_notification',
        search: {
            title: 'New Feature: Memex.Link',
            message:
                'Test Message',
            buttons: [
                {
                    action: {
                        type: actionTypes.OPEN_URL,
                        url: 'https://worldbrain.io',
                        context: 'new-tab',
                    },
                    label: 'Learn More',
                },
            ],
        },
        system: {
            title: 'New Feature: Memex.Link',
            message:
                'Test Message',
            buttons: [
                {
                    action: {
                        type: actionTypes.OPEN_URL,
                        url: 'https://worldbrain.io',
                        context: 'new-tab',
                    },
                    label: 'Learn More',
                },
            ],
        },
        overview: {
            title: 'New Feature: Memex.Link',
            message:
                'Test Message',
            buttons: [
                {
                    action: {
                        type: actionTypes.OPEN_URL,
                        url: 'https://worldbrain.io',
                        context: 'new-tab',
                    },
                    label: 'Learn More',
                },
            ],
        },
    },
*/

export const NOTIFS: NotifDefinition[] = [
    {
        id: 'backups_launch',
        search: {
            title: "Don't lose your knowledge!",
            message: 'Backup your data to Google Drive',
            buttons: [
                {
                    action: {
                        type: actionTypes.OPEN_URL,
                        url: 'https://worldbrain.io/pricing',
                        context: 'new-tab',
                    },
                    label: 'Backup Now',
                },
            ],
        },
        overview: {
            title: "Don't lose your knowledge!",
            message:
                'Backup your data for free with our new Google Drive backup.',
            buttons: [
                {
                    action: {
                        type: actionTypes.OPEN_URL,
                        url: '/options.html#/backup',
                        context: 'new-tab',
                    },
                    label: 'Backup Now',
                },
            ],
        },
    },
    {
        id: 'backup_error',
        system: {
            title: 'Error backing up data.',
            message: 'Please check your internet connectivity',
            buttons: [
                {
                    action: {
                        type: actionTypes.OPEN_URL,
                        url: '/options.html#/backup',
                        context: 'new-tab',
                    },
                    label: 'Backup Now',
                },
            ],
        },
        overview: {
            title: 'Error backing up data.',
            message: 'Please check your internet connectivity',
            buttons: [
                {
                    action: {
                        type: actionTypes.OPEN_URL,
                        url: '/options.html#/backup',
                        context: 'new-tab',
                    },
                    label: 'Retry',
                },
            ],
        },
    },
    {
        id: 'drive_size_empty',
        system: {
            title: 'Drive Size',
            message: 'There seems to be no space in your Google Drive',
        },
        overview: {
            title: 'Drive Size',
            message: 'There seems to be no space in your Google Drive',
        },
    },
    {
        id: 'auto_backup_expired',
        system: {
            title: 'Auto Backup',
            message: 'Your auto-backup subscription has ended',
            buttons: [
                {
                    action: {
                        type: actionTypes.OPEN_URL,
                        url: '/options.html#/backup',
                        context: 'new-tab',
                    },
                    label: 'Renew Subscription',
                },
            ],
        },
        overview: {
            title: 'Auto Backup',
            message: 'Your auto-backup subscription has ended.',
            buttons: [
                {
                    action: {
                        type: actionTypes.OPEN_URL,
                        url: '/options.html#/backup',
                        context: 'new-tab',
                    },
                    label: 'Renew Subscription',
                },
            ],
        },
    },
]
