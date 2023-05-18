import request from '~/core/utils/axios';

const loginService = (user) => {
    // const config = {
    //     headers: { Authorization: `Bearer ${token}` }
    // };

    const bodyParameters = {
        ...user
    };

    return request.post(
        'auth/signin',
        bodyParameters
    )
}
const signupService = (user) => {
    // const config = {
    //     headers: { Authorization: `Bearer ${token}` }
    // };
    delete user.confirmPassword
    const bodyParameters = {
        ...user
    };

    return request.post(
        'auth/signup',
        bodyParameters
    )
}
const forgotPasswordService = (user) => {
    // const config = {
    //     headers: { Authorization: `Bearer ${token}` }
    // };

    const bodyParameters = {
        ...user
    };

    return request.post(
        'auth/password-forgot',
        bodyParameters
    )
}
const ChangePasswordService = (user) => {
    const bodyParameters = {
        ...user
    };

    return request.post(
        'auth/password-reset',
        bodyParameters
    )
}
const requestOtpService = (email) => {
    const bodyParameters = {
        ...email
    };
    return request.post(
        'auth/signup/resend-otp',
        bodyParameters
    )
}
const OtpComfirmService = async (req) => {
    const bodyParameters = {
        ...req
    };

    return request.post(
        'auth/signup/confirm',
        bodyParameters
    )
}
export {
    loginService,
    signupService,
    forgotPasswordService,
    ChangePasswordService,
    requestOtpService,
    OtpComfirmService
};