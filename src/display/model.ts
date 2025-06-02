import {makeAutoObservable} from "mobx";
import {makePersistable} from "mobx-persist-store";
import {useEffect} from "react";

export class DisplayModel {
    calculator = true

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true})
        void makePersistable(this, {
            name: 'DisplayModel',
            properties: ['calculator'],
            storage: window.localStorage
        })
    }

    toggleCalculator(event: KeyboardEvent) {
        // Super (Meta на macOS, Windows key на Windows) + K
        const isKey = ['k', 'л'].includes(event.key.toLowerCase())
        if ((event.metaKey || event.ctrlKey) && isKey) {
            this.calculator = !this.calculator;
            event.preventDefault();
        }
    }
}

export const displayModel = new DisplayModel()

export const useDisplayEvent = () => {

    useEffect(() => {
        function event (e: KeyboardEvent) {
            displayModel.toggleCalculator(e)
        }
        window.addEventListener('keydown', event)

        return () => {
            window.removeEventListener('keydown', event)
        }
    }, []);
}