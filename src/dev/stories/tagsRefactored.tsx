import { storiesOf } from '@storybook/react'
import React from 'react'
import { action } from '@storybook/addon-actions'
import TagPicker from 'src/tags/ui/TagPicker'
import { TagResultItem } from 'src/tags/ui/TagPicker/components/TagResultItem'
import EntryRow from 'src/common-ui/GenericPicker/components/EntryRow'
import EntryList from 'src/common-ui/GenericPicker/components/EntryResultsList'
import { withGlobalStyles } from 'src/dev/stories/decorators'

const tags = ['initial', 'tag', 'abcde1', 'abcde2', 'tag 1', 'tag 2']

storiesOf('Tags Refactored', module)
    .addDecorator(withGlobalStyles)
    .add('Tag Picker - All together, Default theme', () => (
        <div>
            <TagPicker
                onUpdateTagSelection={async (selectedTags) => {
                    action('updatedTags')
                }}
                queryTags={async (term) => tags.filter((t) => t.includes(term))}
                loadDefaultSuggestions={() => [tags[4], tags[5]]}
                initialSelectedTags={async () => [tags[0], tags[1]]}
                tagAllTabs={async (tag) => {
                    action('Tag All tabs')
                }}
            />
        </div>
    ))
    .add('Tag Picker - Errors', () => (
        <div>
            <TagPicker
                onUpdateTagSelection={(selectedTags) => {
                    throw new Error('Causing error for test')
                }}
                queryTags={async (term) => tags.filter((t) => t.includes(term))}
                loadDefaultSuggestions={() => [tags[4], tags[5]]}
                initialSelectedTags={async () => [tags[0], tags[1]]}
                tagAllTabs={async (tag) => {
                    action('Tag All tabs')
                }}
            />
        </div>
    ))
    .add('Tag Picker - Long delays in saving shouldnt effect UI', () => (
        <div>
            <TagPicker
                onUpdateTagSelection={(selectedTags) => {
                    return new Promise((resolve) => setTimeout(resolve, 5000))
                }}
                queryTags={async (term) => tags.filter((t) => t.includes(term))}
                loadDefaultSuggestions={() => [tags[4], tags[5]]}
                initialSelectedTags={async () => [tags[0], tags[1]]}
                tagAllTabs={async (tag) => {
                    action('Tag All tabs')
                }}
            />
        </div>
    ))

    .add('Tag List', () => {
        return (
            <div>
                <EntryList
                    id="tagResults"
                    entries={tags.map((t) => ({
                        name: t,
                        selected: false,
                        focused: false,
                    }))}
                    renderEntryRow={() => (
                        <EntryRow
                            name="tag"
                            selected={false}
                            index={1}
                            ResultItem={TagResultItem}
                        />
                    )}
                />
            </div>
        )
    })

    .add('Tag Row', () => (
        <div>
            <EntryRow
                name="tag"
                selected={false}
                index={1}
                ResultItem={TagResultItem}
            />
        </div>
    ))
