import {
  grassImg,
  dirtImg,
  logImg,
  glassImg,
  woodImg,
  stoneImg,
  cobblestoneImg,
  sandImg,
  gravelImg,
  coalOreImg,
  ironOreImg
} from './images.js'

import { NearestFilter, RepeatWrapping, TextureLoader } from 'three'

const grassTexture = new TextureLoader().load(grassImg)
const dirtTexture = new TextureLoader().load(dirtImg)
const logTexture = new TextureLoader().load(logImg)
const glassTexture = new TextureLoader().load(glassImg)
const woodTexture = new TextureLoader().load(woodImg)
const stoneTexture = new TextureLoader().load(stoneImg)
const cobblestoneTexture = new TextureLoader().load(cobblestoneImg)
const sandTexture = new TextureLoader().load(sandImg)
const gravelTexture = new TextureLoader().load(gravelImg)
const coalOreTexture = new TextureLoader().load(coalOreImg)
const ironOreTexture = new TextureLoader().load(ironOreImg)

const groundTexture = new TextureLoader().load(grassImg)

groundTexture.wrapS = RepeatWrapping
groundTexture.wrapT = RepeatWrapping

groundTexture.magFilter = NearestFilter
grassTexture.magFilter = NearestFilter
dirtTexture.magFilter = NearestFilter
logTexture.magFilter = NearestFilter
glassTexture.magFilter = NearestFilter
woodTexture.magFilter = NearestFilter
stoneTexture.magFilter = NearestFilter
cobblestoneTexture.magFilter = NearestFilter
sandTexture.magFilter = NearestFilter
gravelTexture.magFilter = NearestFilter
coalOreTexture.magFilter = NearestFilter
ironOreTexture.magFilter = NearestFilter

export {
  groundTexture,
  grassTexture,
  dirtTexture,
  logTexture,
  glassTexture,
  woodTexture,
  stoneTexture,
  cobblestoneTexture,
  sandTexture,
  gravelTexture,
  coalOreTexture,
  ironOreTexture
}
