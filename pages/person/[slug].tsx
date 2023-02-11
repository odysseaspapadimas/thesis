import { Container, ScrollArea } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { Person, PersonCombinedCreditsResponse } from "moviedb-promise";
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { IMG_URL } from "../../constants/tmdbUrls";
import { CreditCast, CreditCrew } from "../../constants/types";
import { tmdb } from "../../utils/tmdb";

type Credits = PersonCombinedCreditsResponse["cast"];

const Person = ({
  person,
  knownFor,
  credits,
}: {
  person: Person;
  knownFor: Credits;
  credits: any;
}) => {
  const router = useRouter();

  const slug = router.query.slug as string;
  console.log(credits, 'credits')
  const personId = slug.split("-")[0];

  return (
    <div>
      <Head>
        <title>{person.name}</title>
      </Head>
      <Container
        className="relative h-full flex flex-col items-center md:flex-row md:items-start py-4 sm:py-20"
      >
        <div>
          {!person.profile_path ? (
            <div className="bg-gray-400 opacity-80 w-[300px] h-[450px]"></div>
          ) : (
            <Image
              height={450}
              width={300}
              src={IMG_URL(person.profile_path)}
              className="rounded-md flex-1"
              placeholder="blur"
              blurDataURL={`/_next/image?url=${IMG_URL(
                person.profile_path
              )}&w=16&q=1`}
            />
          )}
          <h2 className="text-2xl font-semibold my-2 whitespace">
            Personal Info
          </h2>
          <div className="flex flex-col space-y-6">
            <div>
              <h3 className="font-semibold text-xl">Gender</h3>
              <p>
                {person.gender === 1
                  ? "Female"
                  : person.gender === 2
                    ? "Male"
                    : person.gender === 3
                      ? "Non-binary"
                      : "Not specified"}
              </p>
            </div>

            {person.birthday && (
              <div>
                <h3 className="font-semibold text-xl">Birthday</h3>
                <p>
                  {person.birthday} ({getAge(person.birthday)} years old){" "}
                </p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-xl">Place of Birth</h3>
              <p>{person.place_of_birth}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col self-stretch sm:max-w-lg md:max-w-2xl sm:ml-8">
          <h1 className="font-bold">{person.name}</h1>
          <h2 className="text-2xl font-semibold my-2 whitespace">Biography:</h2>
          <div>
            {person.biography?.split("\n").map((text, i) => (
              <p key={i} className="mb-4">
                {text}
              </p>
            ))}
          </div>
          <div>
            <h2 className="text-2xl font-semibold my-2">Known For</h2>
            <ScrollArea scrollbarSize={14} type="always" className="pb-4">
              <div className="flex space-x-2 ">
                {knownFor?.map((media) => (
                  <div key={media.id} className="flex flex-col rounded-md">
                    {!media.poster_path ? (
                      <div className="bg-gray-400 opacity-80 w-[150px] h-[225px]"></div>
                    ) : (
                      <div className="w-[150px] h-[225px] relative">
                        <NextLink
                          href={`/${media.media_type === "movie" ? "movie" : "show"
                            }/${media.id}-${media.name
                              ?.toLowerCase()
                              .replace(/[\W_]+/g, "-")}`}
                        >
                          <Image
                            src={IMG_URL(media.poster_path)}
                            layout="fill"
                            className="rounded-md"
                          />
                        </NextLink>
                      </div>
                    )}
                    <div className="p-2 max-w-[150px] text-center">
                      <NextLink
                        href={`/${media.media_type === "movie" ? "movie" : "show"
                          }/${media.id}-${media.name
                            ?.toLowerCase()
                            .replace(/[\W_]+/g, "-")}`}
                      >
                        <p className="font-medium hover:text-primary">
                          {media.media_type === "movie"
                            ? media.title
                            : media.name}
                        </p>
                      </NextLink>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="mt-4 flex flex-col border border-gray-500 rounded-md px-4 py-2">
            {/* {credits?.map((media) => (
                            <div key={media.credit_id} className="flex space-x-2">
                                <span>{media.first_air_date ? media.first_air_date.split("-")[0] : media.release_date?.split("-")[0]}</span>
                                <span> - </span>
                                <NextLink href={`/${media.media_type === "movie" ? "movie" : "show"}/${media.id}-${media.name?.toLowerCase().replace(/[\W_]+/g, "-")}`}>
                                    <span className="hover:text-primary">{media.name ? media.name : media.title}</span>
                                </NextLink>
                            </div>
                        ))} */}
            <div className={`my-3 ${person.known_for_department === "Acting" ? "order-1" : "order-2"}`}>
              <h2 className="font-semibold text-3xl">Acting</h2>
              {credits &&
                Object.keys(credits.cast).reverse().map((year) => (
                  <div key={year}>
                    <p className="font-semibold text-lg">{year === "0" ? "-" : year}</p>
                    <div className="ml-4 flex flex-col">
                      {credits.cast[year].map((media: CreditCast) => (
                        <div key={media.credit_id}>
                          <NextLink
                            href={`/${media.media_type === "movie" ? "movie" : "show"
                              }/${media.id}-${media.name
                                ?.toLowerCase()
                                .replace(/[\W_]+/g, "-")}`}
                          >
                            <span className="font-bold hover:text-primary underline">
                              {media.name ? media.name : media.title}
                            </span>
                          </NextLink>
                          {media.character && (
                            <>
                              <span className="text-gray-200"> as </span>
                              <span>{media.character}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              }

            </div>
            {credits?.crew &&
              Object.keys(credits.crew).map((department) => (
                <div key={department} className={`my-3 ${person.known_for_department === department ? "order-1" : "order-2"}`}>
                  <h2 className="font-semibold text-3xl">{department}</h2>
                  <div className="flex flex-col">
                    {Object.keys(credits.crew[department]).reverse().map((year) => (
                      <div key={year}>
                        <p className="font-semibold text-lg">{year === "0" ? "-" : year}</p>
                        <div className="ml-4 flex flex-col">
                          {credits.crew[department][year].map((credit: CreditCrew) => (
                            <div key={credit.credit_id}>
                              <NextLink
                                href={`/${credit.media_type === "movie" ? "movie" : "show"
                                  }/${credit.id}-${credit.name
                                    ?.toLowerCase()
                                    .replace(/[\W_]+/g, "-")}`}
                              >
                                <span className="font-bold hover:text-primary underline">
                                  {credit.name ? credit.name : credit.title}
                                </span>
                              </NextLink>
                              {credit.job && (
                                <>
                                  <span className="text-gray-200"> as </span>
                                  <span>{credit.job}</span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            }
            {/* {groupedCredits &&
              groupedCredits.map((item: any) => (
                <div key={item.id}>
                  <p className="font-semibold text-lg">{item[0] === "0" ? "-" : item[0]}</p>
                  <div className="ml-4 flex flex-col">
                    {item[1].map((media: CreditCast) => (
                      <div key={media.credit_id}>
                        <NextLink
                          href={`/${media.media_type === "movie" ? "movie" : "show"
                            }/${media.id}-${media.name
                              ?.toLowerCase()
                              .replace(/[\W_]+/g, "-")}`}
                        >
                          <span className="font-bold hover:text-primary underline">
                            {media.name ? media.name : media.title}
                          </span>
                        </NextLink>
                        {media.character && (
                          <>
                            <span className="text-gray-200"> as </span>
                            <span>{media.character}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))} */}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Person;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const personId = slug.split("-")[0];

  let personData = await tmdb.personInfo({
    id: personId,
  });

  let credits = await tmdb.personCombinedCredits({ id: personId });

  let knownFor = [] as unknown;

  if (personData.known_for_department === "Acting") {
    knownFor = credits.cast
      ?.slice(0)
      ?.sort((a, b) => {
        //slice(0) creates a new copy as not to mutate the original array
        if (a.popularity && b.popularity) {
          return b.popularity - a.popularity;
        } else {
          return 0;
        }
      })
      .filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i)
      .slice(0, 10);
  } else {
    knownFor = credits.crew
      ?.filter((credit) => credit.department === personData.known_for_department)
      ?.sort((a, b) => {
        //slice(0) creates a new copy as not to mutate the original array
        if (a.popularity && b.popularity) {
          return b.popularity - a.popularity;
        } else {
          return 0;
        }
      })
      .slice(0, 10);
  }

  //   credits?.sort((a, b) => {
  //     let dateA, dateB;
  //     if (a.release_date) dateA = new Date(a.release_date).getTime();
  //     else if (a.first_air_date) dateA = new Date(a.first_air_date).getTime();
  //     else dateA = 0;

  //     if (b.release_date) dateB = new Date(b.release_date).getTime();
  //     else if (b.first_air_date) dateB = new Date(b.first_air_date).getTime();
  //     else dateB = 0;

  //     return dateB - dateA;
  //   });

  credits.cast = credits?.cast?.reduce((group: any, credit) => {
    let year;

    if (credit.first_air_date) {
      year = parseInt(credit.first_air_date.split("-")[0]);
    } else if (credit.release_date) {
      year = parseInt(credit.release_date.split("-")[0]);
    } else {
      year = 0;
    }

    group[year] = group[year] ?? [];
    group[year].push(credit);
    return group;
  }, {});

  credits.crew = credits.crew?.reduce((group: any, credit) => {
    const { department } = credit;

    if (!department) return group;

    group[department] = group[department] ?? [];
    group[department].push(credit);
    return group;
  }, {});

  for (const dep in credits.crew) {
    //@ts-ignore
    credits.crew[dep] = credits.crew[dep].reduce((group: any, credit) => {
      let year;

      if (credit.first_air_date) {
        year = parseInt(credit.first_air_date.split("-")[0]);
      } else if (credit.release_date) {
        year = parseInt(credit.release_date.split("-")[0]);
      } else {
        year = 0;
      }

      group[year] = group[year] ?? [];
      group[year].push(credit);
      return group;
    }, {});
  }

  return {
    props: {
      person: personData,
      knownFor,
      credits
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

const getAge = (dateString: string) => {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};