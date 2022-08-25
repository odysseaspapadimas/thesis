import { Container, ScrollArea } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { Person, PersonCombinedCreditsResponse } from "moviedb-promise";
import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { IMG_URL } from "../../constants/tmdbUrls";
import useUser from "../../hooks/use-user";
import { tmdb } from "../../utils/tmdb";

const Person = ({ person, knownFor, credits }: { person: Person; knownFor: PersonCombinedCreditsResponse['cast']; credits: PersonCombinedCreditsResponse['cast'] }) => {

    const router = useRouter();

    const slug = router.query.slug as string;

    const personId = slug.split("-")[0];

    console.log(person, credits)

    return (
        <div>
            <Head>
                <title>{person.name}</title>
            </Head>
            <Container size="xl" className="relative h-full flex flex-col items-center md:flex-row md:items-start py-4 sm:py-20">
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
                    <h2 className="text-2xl font-semibold my-2 whitespace">Personal Info</h2>
                    <div className="flex flex-col space-y-6">

                        <div>
                            <h3 className="font-semibold text-xl">Gender</h3>
                            <p>{person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : person.gender === 3 ? "Non-binary" : "Not specified"}</p>
                        </div>

                        {person.birthday &&
                            <div>
                                <h3 className="font-semibold text-xl">Birthday</h3>
                                <p>{person.birthday} ({getAge(person.birthday)} years old) </p>
                            </div>
                        }

                        <div>
                            <h3 className="font-semibold text-xl">Place of Birth</h3>
                            <p>{person.place_of_birth}</p>
                        </div>


                    </div>
                </div>
                <div className="flex-1 flex flex-col self-stretch sm:max-w-4xl sm:ml-8">
                    <h1 className="font-bold">{person.name}</h1>
                    <h2 className="text-2xl font-semibold my-2 whitespace">Biography:</h2>
                    <div>{person.biography?.split("\n").map((text, i) => <p key={i} className="mb-4">{text}</p>)}</div>
                    <div>
                        <h2 className="text-2xl font-semibold my-2">Known For</h2>
                        <ScrollArea scrollbarSize={14} type="always" className="pb-4">
                            <div className="flex space-x-2 ">
                                {knownFor?.map((media) => (
                                    <div
                                        key={media.id}
                                        className="flex flex-col rounded-md"
                                    >
                                        {!media.poster_path ? (
                                            <div className="bg-gray-400 opacity-80 w-[150px] h-[225px]"></div>
                                        ) : (
                                            <div className="w-[150px] h-[225px] relative">
                                                <NextLink href={`/${media.media_type === "movie" ? "movie" : "show"}/${media.id}-${media.name?.toLowerCase().replace(/[\W_]+/g, "-")}`}>
                                                    <Image
                                                        src={IMG_URL(media.poster_path)}
                                                        layout="fill"
                                                        className="rounded-md"
                                                    />
                                                </NextLink>
                                            </div>
                                        )}
                                        <div className="p-2 max-w-[150px] text-center">
                                            <NextLink href={`/${media.media_type === "movie" ? "movie" : "show"}/${media.id}-${media.name?.toLowerCase().replace(/[\W_]+/g, "-")}`}>
                                                <p className="font-medium hover:text-primary">{media.media_type === "movie" ? media.title : media.name}</p>
                                            </NextLink>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="font-semibold text-3xl">Acting</h2>
                        {credits?.map((media) => (
                            <div key={media.credit_id} className="flex space-x-2">
                                <span>{media.first_air_date ? media.first_air_date.split("-")[0] : media.release_date?.split("-")[0]}</span>
                                <span> - </span>
                                <NextLink href={`/${media.media_type === "movie" ? "movie" : "show"}/${media.id}-${media.name?.toLowerCase().replace(/[\W_]+/g, "-")}`}>
                                    <span>{media.name ? media.name : media.title}</span>
                                </NextLink>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Person;

export const getStaticProps: GetStaticProps = async (ctx) => {
    const slug = ctx.params?.slug as string;

    const personId = slug.split("-")[0];

    let personData = await tmdb.personInfo({
        id: personId,
    });

    let { cast: credits } = await tmdb.personCombinedCredits({ id: personId });

    console.log(credits, ' crew123')

    const knownFor = credits?.slice(0)?.sort((a, b) => { //slice(0) creates a new copy as not to mutate the original array
        if (a.popularity && b.popularity) {
            return b.popularity - a.popularity
        } else {
            return 0
        }
    }).filter((v, i, a) => a.findIndex(v2 => (v2.id === v.id)) === i).slice(0, 10);

    credits?.sort((a, b) => {
        let dateA, dateB;
        if (a.release_date) dateA = new Date(a.release_date).getTime();
        else if (a.first_air_date) dateA = new Date(a.first_air_date).getTime();
        else dateA = 0;

        if (b.release_date) dateB = new Date(b.release_date).getTime();
        else if (b.first_air_date) dateB = new Date(b.first_air_date).getTime();
        else dateB = 0;

        return dateB - dateA;
    })


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
}