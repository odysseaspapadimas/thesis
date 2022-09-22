import { MovieResult, TvResult } from 'moviedb-promise'
import Image from 'next/image';
import React from 'react'
import { IMG_URL } from '../../constants/tmdbUrls';


export const isMovie = (
    result: MovieResult | TvResult
): result is MovieResult => {
    return (result as MovieResult).media_type === "movie";
};

const Show = ({ onClick, result }: { onClick: any; result: MovieResult | TvResult }) => {

    let name = isMovie(result) ? result.title : result.name;
    let released = (isMovie(result) ? result.release_date : result.first_air_date)?.split("-")[0];

    console.log(result, 'res');

    return (
        <div onClick={() => onClick(result)} className="flex items-center space-x-2 hover:bg-primary p-2 rounded-md cursor-pointer">
            {result.poster_path ? (
                <img
                    src={IMG_URL(result.poster_path)}
                    width={50}
                    height={75}
                    className="rounded-tl-lg rounded-bl-lg"
                />
            ) : (
                <div className="bg-slate-800 w-[50px] h-[75px] grid place-items-center">

                </div>
            )}

            <p className="text-sm">{name} ({released})</p>
        </div>
    )
}

export default Show