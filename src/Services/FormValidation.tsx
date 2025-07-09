const signupValidation = (name: string, value: string) => {
    switch (name) {
        case "name":
            if (value.length === 0) return "Name is required.";
            return "";

        case "email":
            if (value.length === 0) return "Email is required.";
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
                return "Email is invalid.";
            return "";

        case "password":
            if (value.length === 0) return "Password is required.";
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(value))
                return "Password must be 8-15 characters.";
            return "";

        case "mobile":
            if (value.length === 0) return "Mobile number is required.";
            if (!/^[6-9]\d{9}$/.test(value))
                return "Mobile number is invalid. It should be 10 digits starting with 6-9.";
            return "";

        default:
            return "";
    }
};


// ✅ Separate function for real-time password validation criteria
const validatePassword = (password: string) => {
    return {
        length: password.length >= 8 && password.length <= 15,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        specialChar: /[@$!%*?&]/.test(password),
    };
};
const loginValidation = (name: string, value: string) => {
    switch (name) {
        
        case "email":
            if (value.length === 0) return "Email is required.";
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value))
                return "Email is invalid.";
            return "";

        case "password":
            if (value.length === 0) return "Password is required.";
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(value))
                return "Password must this creteria";
            return "";

        default:
            return "";
    }
};
export { signupValidation, validatePassword , loginValidation};

