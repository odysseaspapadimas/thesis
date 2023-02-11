import { IMG_URL } from "../../constants/tmdbUrls";
import { TVShowType } from "../../constants/types"
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

type Props = {
    episode: TVShowType["next_episode_to_air"];
    backdrop: string
    airDate: Date | undefined;
    title: string;
}
const Episode = ({ episode, backdrop, airDate, title }: Props) => {
    console.log(airDate, title, 'airdate')
    return (
        <div className="">
            <h2 className="text-2xl font-semibold mb-2">{title}</h2>

            <div className="relative">
                <img className="w-[400px] brightness-[0.4] rounded-sm" src={IMG_URL(episode?.still_path ? episode?.still_path : backdrop)} style={{ aspectRatio: "500 / 281" }} />
                {airDate &&
                    /* @ts-ignore */
                    <p className="absolute left-4 top-4 py-1 px-2 text-sm bg-primary rounded-sm z-10">{dayjs(airDate).format("DD MMM YYYY hh:mm")} - {dayjs(airDate).fromNow()}</p>
                }
                <p className="font-semibold text-lg absolute bottom-4 left-4 z-10" >{episode?.season_number && `${episode.season_number}x`}{episode?.episode_number} - {episode?.name}</p>
            </div>
        </div >
    )
}
export default Episode