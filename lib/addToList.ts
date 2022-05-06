//Used to add to watched, plan to and favorite lists

type Category = "watched" | "plan" | "favorite";
const addToList = async (category: Category, id: string) => {
  const res = await fetch(`/api/user/list/add?type=${category}&id=${id}`, {
    method: "POST",
  });

  const response = await res.json();

  if (response.success) {
    return { success: true };
  }
};

export default addToList;
