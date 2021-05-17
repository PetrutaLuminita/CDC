const { Datastore } = require("@google-cloud/datastore");
const uuid = require('uuid');

const projectId = 'project1-313716'
const keyFilename = 'project1-313716-a1436b4505bf.json'

const datastore = new Datastore({ projectId, keyFilename });

const kind = 'Product';

/**
 * Add product
 * 
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.addProduct = (req, res) => {
  const { name, price, quantity, description } = req.query
  const id = uuid.v4();
  const key = datastore.key([kind, id]);
  const data = { id, name, price, quantity, description }
  const product = { key, data };

  datastore
    .save(product)
    .then(() => {
      console.log(`New product added: ${product.key.name}. Quantity: ${product.data.quantity} pieces. Price: ${product.data.price} RON.`);
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
};
