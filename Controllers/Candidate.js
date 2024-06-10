import { Jobs } from "../Models/Job.js";


const jobList = async (req, res) => {
    try {
      const list = await Jobs.find({});
      console.log(list);
      res.status(200).json({
        success: true,
        jobs: list,
      });
    } catch (err) {
      console.log(err);
    }
  };

export {jobList }