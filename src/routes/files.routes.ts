import { Router } from "express";
import { Request, Response } from 'express';
import multer from 'multer';
import Auth from "../middleware/auth.middleware";

const filesRouter = Router();
const upload = multer({ dest: './uploads/' })

filesRouter.post('/createicon', [ Auth, upload.single('icon') ], async (req: Request, res: Response) => {
  try {
    const iconFile = req.file as Express.Multer.File;
    res.json({ filePath: iconFile.path });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
  }
})

export default filesRouter;