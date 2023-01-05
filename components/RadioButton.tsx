
interface Props {
    checked: boolean;
}

const RadioButton: React.FC<Props> = ({ checked }) => {
    if (checked) {
        return (
            <input id="list-radio-license" type="radio" value="" readOnly={true} checked name="list-radio" className="w-4 h-4 mr-1 border-gray-300 rounded-full shadow-sm appearance-none bg-gradient-radial shadow-myDarkGreen from-green-400 to-myGreen active:ring-green-500 dark:active:ring-green-600 " />
        )
    } else {
        // return <input id="list-radio-license" type="radio" value="" name="list-radio" disabled className="w-4 h-4 mr-1 border-gray-300 rounded-full shadow-sm appearance-none bg-gradient-radial shadow-myDarkRed from-red-400 to-myRed focus:ring-red-500 dark:focus:ring-red-600 " />
        return <input id="list-radio-license" type="radio" value="" readOnly={true} name="list-radio" disabled className="w-4 h-4 mr-1 border-gray-300 rounded-full shadow-sm appearance-none bg-gradient-radial from-gray-200 via-gray-200 to-gray-400 active:ring-red-500 dark:active:ring-red-600 " />
    }
}

export default RadioButton;