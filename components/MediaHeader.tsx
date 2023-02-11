import { Container } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { FastAverageColor } from "fast-average-color";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "tabler-icons-react";
import { IMG_URL } from "../constants/tmdbUrls";
import { TVShowType } from "../constants/types";

type Props = {
    media: TVShowType
}

const fac = new FastAverageColor();

const MediaHeader = ({ media }: Props) => {

    const router = useRouter();

    const [bgColor, setBgColor] = useState<string | undefined>(undefined);

    useEffect(() => {
        fac.getColorAsync(IMG_URL(media.poster_path)).then((color) => setBgColor(color.hex))
    }, [media])

    return (
        <header className={`${!bgColor && "bg-primary"}`} style={{ backgroundColor: bgColor }}>
            <Container size="xl" className="flex items-center space-x-4 py-4">
                {media.poster_path &&
                    <Image src={IMG_URL(media.poster_path)} alt="media poster path" width={100} height={150} className="rounded-md" />
                }
                <div>
                    <h1 className='font-semibold text-2xl sm:text-3xl'>{media.name} <span className="text-gray-300 font-normal">({media.first_air_date?.split("-")[0]})</span></h1>
                    <NextLink href={`/show/${router.query.slug}/seasons`}>
                        <div className="flex items-center space-x-2 text-gray-200 hover:text-gray-300">
                            <ArrowLeft className="" />
                            <span className="text-sm ">Go back to seasons lists</span>
                        </div>
                    </NextLink>
                </div>
            </Container>
        </header>
    )
}
export default MediaHeader