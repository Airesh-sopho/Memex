import React from 'react'
import { remoteFunction } from 'src/util/webextensionRPC'
const localStyles = require('./running-process.css')
import { ProgressBar } from '../components/progress-bar'
import MovingDotsLabel from '../components/moving-dots-label'
import { PrimaryButton } from '../components/primary-button'
import LoadingBlocker from '../components/loading-blocker'
import { FailedOverlay } from '../components/overlays'
const STYLES = require('../styles.css')

interface Props {
    functionNames: {
        info: string
        start: string
        cancel: string
        pause: string
        resume: string
        sendNotif: string
    }
    eventMessageName: string
    preparingStepLabel: string
    synchingStepLabel: string
    renderHeader: () => any
    renderFailMessage: (errorId: string) => any
    renderSuccessMessage: () => any
    onFinish: () => void
}

export default class RunningProcess extends React.Component<Props> {
    state = {
        status: null,
        info: null,
        canceling: false,
        overlay: null,
    }

    async componentDidMount() {
        window['browser'].runtime.onMessage.addListener(this.messageListener)

        const info = await remoteFunction(this.props.functionNames.info)()
        if (info) {
            this.setState({
                status: 'running',
                info,
            })
        } else {
            await this.startRestore()
        }

        // this.setState({
        //     status: 'running',
        //     info: { state: 'preparing' },
        // })
        // this.setState({
        //     status: 'running',
        //     info: { state: 'pausing', totalChanges: 1000, processedChanges: 500 },
        // })
        // this.setState({
        //     status: 'success',
        //     info: { state: 'synching', totalChanges: 1000, processedChanges: 1000 },
        // })
        // this.setState({
        //     status: 'fail',
        //     info: { state: 'synching', totalChanges: 1000, processedChanges: 10 },
        // })
    }

    componentWillUnmount() {
        window['browser'].runtime.onMessage.removeListener(this.messageListener)
    }

    startRestore = async () => {
        this.setState({
            status: 'running',
            info: { state: 'preparing' },
        })
        await remoteFunction(this.props.functionNames.start)()
    }

    messageListener = message => {
        if (message.type === this.props.eventMessageName) {
            this.handleProcessEvent(message.event)
        }
    }

    async handleProcessEvent(event) {
        if (event.type === 'info') {
            this.setState({
                status: 'running',
                info: event.info || this.state.info,
            })
        } else if (event.type === 'success') {
            this.setState({ status: 'success' })
        } else if (event.type === 'fail') {
            const errorId = await remoteFunction(
                this.props.functionNames.sendNotif,
            )('error')
            // Set the status as fail and also update the info as to
            // what the reason of the failure was
            let overlay = null
            console.log(event.error)
            if (event.error === 'Backup file not found') {
                overlay = true
            }
            this.setState({
                status: 'fail',
                info: {
                    state:
                        errorId === 'backup_error'
                            ? 'network-error'
                            : 'full-drive',
                },
                overlay,
            })
        }
    }

    handlePause() {
        const info = this.state.info
        info.state = 'pausing'
        this.setState({ info })
        remoteFunction(this.props.functionNames.pause)()
    }

    handleResume() {
        remoteFunction(this.props.functionNames.resume)()
    }

    async handleCancel() {
        this.setState({ canceling: true })
        await remoteFunction(this.props.functionNames.cancel)()
        this.props.onFinish()
    }

    renderRunning(info) {
        const progressPercentage =
            info.processedChanges && info.totalChanges
                ? info.processedChanges / info.totalChanges
                : 0

        return (
            <div>
                {this.props.renderHeader()}
                <div className={STYLES.subtitle2}>
                With a lot of data (> 25.000 pages) it is recommended running this over night. 
                </div>
                <div className={localStyles.steps}>
                    {this.renderSteps(info)}
                    <ProgressBar value={progressPercentage} />
                </div>
                {this.renderActions(info)}
            </div>
        )
    }

    renderSteps(info) {
        return (
            <React.Fragment>
                <div className={localStyles.step}>
                    <div className={localStyles.stepLabel}>
                        <span className={localStyles.stepNumber}>Step 1:</span>
                        {this.props.preparingStepLabel}
                    </div>
                    <div className={localStyles.stepStatus}>
                        {info.state === 'preparing' && <span className={localStyles.statusMessageActive}>running</span>}
                        {info.state !== 'preparing' && <img src="/img/checkmarkGreen.svg"/>}
                    </div>
                </div>
                <div className={localStyles.step}>
                    <div className={localStyles.stepLabel}>
                        <span className={localStyles.stepNumber}>Step 2:</span>
                        {this.props.synchingStepLabel}
                    </div>
                    <div className={localStyles.stepStatus}>
                        {info.state === 'preparing' && <span className={localStyles.statusMessageWaiting}>up next</span>}
                        {status === 'running' &&
                            info.state !== 'preparing' &&
                            <span className={localStyles.statusMessageActive}>running</span>}
                        {status === 'success' && <img src="/img/checkmarkGreen.svg"/>}
                    </div>
                </div>
            </React.Fragment>
        )
    }

    renderActions(info) {
        return (
            <div className={localStyles.actions}>
                {info.state !== 'paused' &&
                    info.state !== 'pausing' && (
                        <div
                            className={localStyles.actionCancel}
                            onClick={() => {
                                !this.state.canceling && this.handleCancel()
                            }}
                        >
                            {!this.state.canceling && 'Cancel'}
                            {this.state.canceling && (
                                <MovingDotsLabel
                                    text="Finishing current batch"
                                    intervalMs={500}
                                />
                            )}
                        </div>
                    )}
            </div>
        )
    }

    renderSuccess() {
        return (
            <div className={localStyles.finish}>
                {this.props.renderSuccessMessage()}
                <PrimaryButton
                    onClick={() => {
                        this.props.onFinish()
                    }}
                >
                    Return to Settings
                </PrimaryButton>
            </div>
        )
    }

    renderFail() {
        return (
            <div className={localStyles.finish}>
                {this.props.renderFailMessage(this.state.info.state)}
                <PrimaryButton
                    onClick={() => {
                        this.props.onFinish()
                    }}
                >
                    Return to Settings
                </PrimaryButton>
            </div>
        )
    }

    render() {
        const { info, status, overlay } = this.state
        if (!info) {
            return <LoadingBlocker />
        }

        return (
            <div>
                {status === 'running' && this.renderRunning(info)}
                {status === 'success' && this.renderSuccess()}
                {status === 'fail' && this.renderFail()}
                <FailedOverlay
                    disabled={!overlay}
                    onClick={async action => {
                        if (action === 'continue') {
                            await this.startRestore()
                        }
                        this.setState({
                            overlay: null,
                        })
                    }}
                />
            </div>
        )
    }
}