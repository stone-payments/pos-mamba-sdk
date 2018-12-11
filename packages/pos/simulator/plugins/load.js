import Core from '../core.js';
import './registry/register.js';
import './hardware/register.js';
import './driver/register.js';
import './app/register.js';
import './view/register.js';

Core.Registry.setBoot(true);
