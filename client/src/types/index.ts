export interface ChildProps {
	children: React.ReactNode
}

export interface IError extends Error {
	response: { data: { message: string } }
}

export interface IUser {
	email: string
	fullName: string
	username: string
	image: string | null
	followers: IUser[] | []
	following: IUser[] | []
	bio: string | null
	isClose: boolean
}