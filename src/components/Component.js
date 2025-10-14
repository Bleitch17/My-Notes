export class Component {
    constructor() {
        if (new.target === Component) {
            throw new Error("Component is intended to be abstract, and should not be instantiated directly.");
        }
    }

    mount(container) {
        throw new Error("mount() must be implemented.");
    }

    unmount() {
        throw new Error("unmount() must be implemented.");
    }
}
