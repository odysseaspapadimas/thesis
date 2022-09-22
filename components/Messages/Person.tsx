import { PersonResult } from "moviedb-promise"
import Image from "next/image"
import { User } from "tabler-icons-react"
import { IMG_URL } from "../../constants/tmdbUrls"

const Person = ({ onClick, result }: { onClick: any; result: PersonResult }) => {
    return (
        <div onClick={() => onClick(result)} className="flex items-center space-x-2 hover:bg-primary p-2 rounded-md cursor-pointer">
            {result.profile_path ?
                <Image src={IMG_URL(result.profile_path)} width={50} height={75} />
                : (
                    <div className="bg-slate-800 w-[50px] h-[75px] grid place-items-center">
                        <User />
                    </div>
                )}
            <p>{result.name}</p>
        </div>
    )
}

export default Person