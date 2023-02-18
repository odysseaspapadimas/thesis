import { Rating } from "@mantine/core"
import { NextLink } from "@mantine/next"
import Image from "next/image"
import { useRouter } from "next/router"

type Props = {
  rating: { username: string, rating: number, review: string, image_url: string }

}
const Review = ({ rating: { username, rating, review, image_url } }: Props) => {
  const router = useRouter();

  console.log(username, rating, "rewivew")

  return (
    <div className="flex space-x-4 items-start">
      <Image src={image_url} width={50} height={50} className="rounded-full" />

      <div className="flex flex-col space-y-2">
        <div className="flex space-x-2 items-center">
          <NextLink href={`${router.asPath}/review/${username}`}>
            <p className="text-sm text-gray-400 hover:text-gray-200">Review by <span className="font-semibold text-white">{username}</span></p>
          </NextLink>
          {rating &&
            <Rating value={rating} fractions={2} readOnly  />
          }
        </div>

        <p>{review}</p>
      </div>
    </div>
  )
}
export default Review