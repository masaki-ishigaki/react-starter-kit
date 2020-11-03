// setup file
// Enzyme
import { configure } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
configure({ adapter: new Adapter() })

// dotenv
import dotenv from "dotenv"
import path from "path"
dotenv.config({
  path: path.resolve(process.cwd(), "env/development.env"),
})
