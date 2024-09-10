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

const getUploadedImageId = async (form) => {
  const uploadedImageId = fetch(`http://localhost:5000/api/upload/image`, {
    method: "POST",
    body: form
  }).then(function (a) {
    return a.json(); // call the json method on the response to get JSON
  }).then(function (res) {
    const uploadedImageId = res.metadata.id;
    return uploadedImageId;
    // const uploadedCategory = await prisma.category.create({
    //   data: {
    //     name: category.name,
    //     slug: getSlug(category.name),
    //     parentId: category.parentId,
    //     thumbnailImageId: uploadedImageId,
    //   },
    // });
    // console.log("Uploaded category: ", uploadedCategory);

  });
  console.log("Uploaded image id: ", uploadedImageId);
  return uploadedImageId;
}


module.exports = {
  sortObject,
  getGenderFromQuery,
  changeImageUrlToFile,
  getUploadedImageId
};
