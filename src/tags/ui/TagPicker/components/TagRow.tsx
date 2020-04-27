import React, { SyntheticEvent } from 'react'
import styled from 'styled-components'
import { TagResultItem } from 'src/tags/ui/TagPicker/components/TagResultItem'
import { Check, Layers, X as XIcon } from '@styled-icons/feather'
import { StyledIconBase } from '@styled-icons/styled-icon'
import ButtonTooltip from 'src/common-ui/components/button-tooltip'
import { opacify } from 'polished'
import { DisplayTag } from 'src/tags/ui/TagPicker/logic'

interface Props {
    onPress?: (tag: DisplayTag) => void
    onFocus?: (tag: DisplayTag, index?: number) => void
    onPressTagAll?: (tag: DisplayTag, index?: number) => void
    index: number
    name: string
    selected?: boolean
    focused?: boolean
}

class TagRow extends React.Component<Props> {
    _getTag = props => {
        const { name, selected, focused } = this.props
        return { name, selected, focused }
    }

    handleTagPress = () => {
        this.props.onPress && this.props.onPress(this._getTag(this.props))
    }

    handleTagAllPress = (e: SyntheticEvent) => {
        this.props.onPressTagAll &&
            this.props.onPressTagAll(this._getTag(this.props))
        e.preventDefault()
        e.stopPropagation()
        return false
    }

    handleMouseOver = () => {
        this.props.onFocus &&
            this.props.onFocus(this._getTag(this.props), this.props.index)
    }

    handleMouseOut = () => {
        this.props.onFocus && this.props.onFocus(this._getTag(this.props), null)
    }

    render() {
        const { name, selected, focused, onPressTagAll } = this.props

        return (
            <Row
                onClick={this.handleTagPress}
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                isFocused={focused}
            >
                <TagResultItem selected={selected} isFocused={focused}>
                    {name}
                </TagResultItem>

                <IconStyleWrapper show={focused}>
                    {selected && (
                        <ButtonTooltip
                            tooltipText="Remove tag from page"
                            position="left"
                        >
                            <XIcon size={20} onClick={this.handleTagPress} />
                        </ButtonTooltip>
                    )}
                    {onPressTagAll && (
                        <ButtonTooltip
                            tooltipText="Tag all tabs in window"
                            position="left"
                        >
                            <TagAllTabsButton
                                size={20}
                                onClick={this.handleTagAllPress}
                            />
                        </ButtonTooltip>
                    )}
                </IconStyleWrapper>
            </Row>
        )
    }
}

export const TagAllTabsButton = styled(Layers)`
    pointer-events: auto !important;
`

export const IconStyleWrapper = styled.div`
    display: inline-flex;

    ${StyledIconBase} {
        stroke-width: 2px;
        color: ${props =>
            props.isFocused
                ? props.theme.tag.hoverIcon
                : opacify(0.5, props.theme.tag.icon)};
        opacity: ${props => (props.show ? '1' : '0')};
        transition: all 0.3s;
        pointer-events: none;
        padding: 2px;
        border-radius: 3px;
        &:hover {
            color: ${props => props.theme.tag.iconHover};
            background: ${props => props.theme.tag.iconHoverBg};
        }
    }
`

const Row = styled.div`
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.border};
    display: flex;
    padding: 4px 20px 4px 18px; // give space to the right for a scrollbar
    justify-content: space-between;
    transition: background 0.3s;
    cursor: pointer;
    background: ${props => props.isFocused && props.theme.border};
`

export default TagRow
