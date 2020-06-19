import { injectable } from 'inversify';
import Installer from './Installer';

@injectable()
export default class ClientInstaller extends Installer {}
