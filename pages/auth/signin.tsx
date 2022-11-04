import SignInForm from "@/components/SignInForm";

interface Props {

}

const SignIn: React.FC<Props> = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-full my md:w-1/2">
                <SignInForm />
            </div>
        </div>
    )
}

export default SignIn;