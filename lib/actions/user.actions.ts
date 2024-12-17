"use server";

export const signIn = async userData => {
	try {
		console.log(userData);
	} catch (error) {
		console.log(error);
	}
};

export const signUp = async (userData: SignUpParams) => {
	try {
		console.log(userData);
	} catch (error) {
		console.log(error);
	}
};
