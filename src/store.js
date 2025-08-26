import {PROJECT_STORE,ProjectStore} from './project/project/store/ProjectStore';

import {orgStores} from "tiklab-user-ui/es/store"
import {privilegeStores} from "tiklab-privilege-ui/es/store"
import {createContext} from 'react'
function createStores() {
    return{
        ...orgStores,
        ...privilegeStores,
        [PROJECT_STORE]:new ProjectStore(),
    }
}

const store = createStores();
const storeContext = createContext(store)

export {
    store,
    PROJECT_STORE,
    storeContext
}
