const { Datastore } = require("@google-cloud/datastore");

const projectId = 'project1-313716'
const keyFilename = 'project1-313716-a1436b4505bf.json'

const datastore = new Datastore({ projectId, keyFilename });

const kind = 'Product';

const getProducts = async () => {
  const query = datastore.createQuery(kind)
  return datastore.runQuery(query);
};

/**
 * Get products
 * 
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.getProducts = async (req, res) => {
  const [entities] = await getProducts();
  res.set('Access-Control-Allow-Origin', 'https://europe-central2-project1-313716.cloudfunctions.net/getProducts');
  return res.json(entities);
};