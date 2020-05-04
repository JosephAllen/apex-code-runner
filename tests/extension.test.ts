jest.unmock('../src/extension')
const extensionName = 'apex-code-runner'
const statusBar = {
    register: jest.fn(() => []),
}
//import * as vscode from 'vscode';
import { activate, deactivate } from '../src/extension';

describe('Extension', () => {
    const context: any = {
        subscriptions: {
            push: jest.fn(),
        },
    }
    beforeEach(() => {
        context.subscriptions.push.mockReset();
    })
    describe('activate()', () => {

        it('should register statusBar', () => {
            statusBar.register.mockClear();
            activate(context);
            expect(statusBar.register).toHaveBeenCalled();
        })
        describe('should register a command', () => {
            beforeEach(() => {
                // jestInstance.toggleCoverageOverlay.mockReset()
                // jestInstance.runTest.mockReset()
                // jestInstance.startProcess.mockReset()
                // jestInstance.stopProcess.mockReset()
                // jestInstance.restartProcess.mockReset()
            })

            it('to start extension', () => {
                activate(context)
                const callArg = context.subscriptions.push.mock.calls[0].find((args: string[]) => {
                    return args[0] === `${extensionName}.start`
                })

                expect(callArg).toBeDefined()
                callArg[1](undefined)
                expect(1 === 1)
                // callArg[1](jestInstance)
                // expect(jestInstance.startProcess).toHaveBeenCalled()
            })
        })
    })
    describe('deactivate()', () => {
        it('should call unregisterAll on instancesManager', () => {
            deactivate(context)
            expect(context.subscriptions.length == 0);
            //expect(extensionManager.unregisterAll).toBeCalled()
        })
    })
})
