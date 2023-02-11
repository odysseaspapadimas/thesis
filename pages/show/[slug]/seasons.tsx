import { Container } from "@mantine/core";
import { NextLink } from "@mantine/next";
import dayjs from "dayjs";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { ArrowLeft } from "tabler-icons-react";
import { IMG_URL } from "../../../constants/tmdbUrls";
import { TVShowType } from "../../../constants/types";
import { tmdb } from "../../../utils/tmdb";
import { FastAverageColor } from 'fast-average-color';

const fac = new FastAverageColor();

type Props = {
  show: TVShowType;
};
const seasons = ({ show }: Props) => {
  const router = useRouter();

  const [bgColor, setBgColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    fac.getColorAsync(IMG_URL(show.poster_path)).then((color) => setBgColor(color.hex))
  }, [show])

  return (
    <div>
      <header className={`${!bgColor && "bg-primary"}`} style={{ backgroundColor: bgColor }}>
        <Container className="flex items-center space-x-4 py-4">
          {show.poster_path && (
            <Image
              src={IMG_URL(show.poster_path)}
              alt="season poster path"
              width={75}
              height={125}
              className="rounded-md"
            />
          )}
          <div>
            <h1 className="className='font-semibold text-2xl sm:text-3xl">
              {show.name}{" "}
              <span className="text-gray-300 font-normal">
                ({show.first_air_date.split("-")[0]}-
                {show.status === "Ended" &&
                  show.last_air_date &&
                  show.last_air_date.split("-")[0]}
                )
              </span>
            </h1>
            <NextLink href={`/show/${router.query.slug}`}>
              <div className="flex items-center space-x-2 text-gray-200 hover:text-gray-300">
                <ArrowLeft className="" />
                <span className="text-sm ">Go back to show</span>
              </div>
            </NextLink>
          </div>
        </Container>
      </header>
      <Container my={16}>
        <div className="flex flex-col space-y-8">
          {show.seasons.map((season) => (
            <div key={season.id} className="flex items-start space-x-4">
              <NextLink href={`/show/${router.query.slug}/season/${season.season_number}`}>
                <div style={{ width: 125, height: 175 }}>
                  <Image src={IMG_URL(season.poster_path)} width={125} height={175} layout="fixed" className="rounded-md" />
                </div>
              </NextLink>
              <div className="flex flex-col flex-wrap">
                <div className="flex flex-wrap items-end">
                  <NextLink href={`/show/${router.query.slug}/season/${season.season_number}`}>
                    <h2 className="text-2xl font-semibold mr-4 hover:text-gray-300">{season.name}</h2>
                  </NextLink>

                  <h4 className=' font-semibold'>
                    {season?.air_date?.split("-")[0]} | {season.episode_count}{" "}
                    Episodes
                  </h4>
                </div>
                <div>
                  <p className="mt-2 mb-4">Season {season.season_number} of {show.name} premiered on {dayjs(season.air_date).format("MMM DD, YYYY")}</p>
                  <span className="text-sm sm:text-base whitespace-pre-wrap">
                    {season.overview.split("\n").map((text, i) => (
                      <p key={i} className="mb-2">{text}</p>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
export default seasons;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const showId = slug.split("-")[0];
  const season_number = Number(ctx.params?.season);

  const showData = await tmdb.tvInfo({
    id: showId,
  });

  //const season = await tmdb.seasonInfo({ id: showId, season_number })

  const showName = showData.name?.toLowerCase().replace(/[\W_]+/g, "-");

  if (!slug.split("-").slice(1).join("-")) {
    return {
      redirect: {
        destination: `/show/${showId}-${showName}/seasons`,
        permanent: true,
      },
    };
  }

  return {
    props: {
      show: showData,
    },
    revalidate: 60 * 60 * 24, //Once a day
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
