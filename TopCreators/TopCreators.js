// calculating the entire worth of NFT created by a single user
export const getTopCreators = (creators) => {
  const finalCreators = [];

  const finalResults = creators.reduce((index, currentValue) => {
    (index[currentValue.seller] = index[currentValue.seller] || []).push(
      currentValue
    );

    return index;
  }, {});

  Object.entries(finalResults).forEach((item) => {
    const seller = item[0];
    const total = item[1]
      .map((newItem) => Number(newItem.price))
      .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    finalCreators.push({ seller, total }); // pushing what a single seller created as total worth of NFTs
  });

  return finalCreators;
};
