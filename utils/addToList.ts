//Used to add to watched, plan to and favorite lists

type List = "watched" | "plan" | "favorites";
export type Type = "movie" | "show";
const addToList = async (list: List, id: string, type: Type) => {
  const res = await fetch(
    `/api/user/list/add?list=${list}&id=${id}&type=${type}`,
    {
      method: "POST",
    }
  );

  const response = await res.json();

  if (response.success) {
    return { success: true };
  }
};

export default addToList;
