import app from './src/app.js';
import { config } from './src/config/config.js';
import connectDB from './src/config/db.js';

const startServer = async () => {
  const port = config.port || 5000;

  await connectDB();
  
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
};
startServer();
