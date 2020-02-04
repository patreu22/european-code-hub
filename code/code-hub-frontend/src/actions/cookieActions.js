import { resetUserData } from '../slices/userSlice'
import { removeVerificationToken } from '../helper/cookieHelper'

export function logoutUser() {
    return function (dispatch) {
        removeVerificationToken()
        dispatch(resetUserData())
    }
}