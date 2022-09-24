const Nft = require('../../models/nft');

// const nfts = async nftsIds => {
//     try {
//         const nfts = await Nft.find({
//             _id: {
//                 $in: nftsIds
//             }
//         });
//         return nfts.map(nft => {
//             return transformNft(nft);
//         });
//     } catch (err) {
//         throw err;
//     }
// };



// const singleEvent = async eventId => {
//     try {
//         const event = await Event.findById(eventId);
//         return transformEvent(event);
//     } catch (err) {
//         throw err;
//     }
// };

// const singleShop = async shopId => {
//     try {
//         const shop = await Shop.findById(shopId);
//         return transformShop(shop);
//     } catch (err) {
//         throw err;
//     }
// }

const singleNft = async tokenId => {
    try {
        const nft = await Nft.findById(tokenId);
        return {
            ...nft._doc,
            _id: nft.id,
        };
    } catch (err) {
        throw err;
    }
};

// const user = async userId => {
//     try {
//         const user = await User.findById(userId);
//         return {
//             ...user._doc,
//             _id: user.id,
//             createdEvents: events.bind(this, user._doc.createdEvents)
//         };
//     } catch (err) {
//         throw err;
//     }
// };

const transformNft = nft => {
    return {
        ...nft._doc,
        _id: nft.id,
    };
};

// const transformShop = shop => {
//     return {
//         ...shop._doc,
//         _id: shop.id,

//     };
// };

// const transformBuy = buy => {
//     return {
//         ...buy._doc,
//         _id: buy.id,
//         user: user.bind(this, buy._doc.user),
//         shop: singleShop.bind(this, buy._doc.shop),
//     }
// }


// const transformBooking = booking => {
//     return {
//         ...booking._doc,
//         _id: booking.id,
//         user: user.bind(this, booking._doc.user),
//         event: singleEvent.bind(this, booking._doc.event),
//         createdAt: dateToString(booking._doc.createdAt),
//         updatedAt: dateToString(booking._doc.updatedAt)
//     };
// };

// exports.transformEvent = transformEvent;
// exports.transformBooking = transformBooking;
// exports.transformShop = transformShop;
// exports.transformBuy = transformBuy;
exports.transformNft = transformNft;

//exports.nfts = nfts;
exports.singleNft = singleNft;
// exports.events = events;
// exports.singleEvent = singleEvent;