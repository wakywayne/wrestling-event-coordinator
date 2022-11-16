import SignInForm from "@/components/SignInForm";

interface Props {

}

const SignIn: React.FC<Props> = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-full md:w-1/2 3xl:w-1/3">
                <SignInForm />
            </div>
        </div>
    )
}

export default SignIn;