import { useEffect } from 'react';

const ResetPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showResetPassword('#authentication-reset-password');
    }, []);

    return (
        <div className="flex-1 py-12 px-5 flex justify-center items-center min-h-screen bg-background">
            <div id="authentication-reset-password" className="bg-surface-800 mx-auto w-[400px] max-w-full p-10 rounded-2xl border border-surface-600"></div>
        </div>
    );
};

export default ResetPassword;