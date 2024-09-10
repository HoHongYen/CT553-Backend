function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

async function getGenderFromQuery(query) {
  const prisma = require("../config/prismaClient");

  const genderRegex = /(nam|nữ|trẻ em)/i;
  const gender = query.toLowerCase().match(genderRegex)?.at(0);
  if (gender) {
    const genderCategories = await prisma.category.findMany({
      where: {
        parentId: null,
      },
    });

    return genderCategories.find(
      (category) => category.name.toLowerCase() === gender
    );
  }
  return null;
}

const getUrlExtension = (url) => {
  return url.split(/[#?]/)[0].split(".").pop().trim();
};

const changeImageUrlToFile = async (imgUrl) => {
  var imgExt = getUrlExtension(imgUrl);

  const response = await fetch(imgUrl);
  const blob = await response.blob();
  const file = new File([blob], "categoryImage." + imgExt, {
    type: blob.type,
  });
  return file;
}

module.exports = {
  sortObject,
  getGenderFromQuery,
  changeImageUrlToFile
};
