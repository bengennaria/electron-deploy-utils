'use strict'


/**
 * Modules
 * External
 * @constant
 */
const globby = require('globby')
const logger = require('@sidneys/logger')({ timestamp: false })


/**
 * Artifact file extensions
 * @const
 * @global
 */
const extensionList = [
    '7z',
    'apk',
    'AppImage',
    'deb',
    'dmg',
    'exe',
    'freebsd',
    'msi',
    'p5p',
    'pacman',
    'pkg',
    'rpm',
    'snap',
    'zip'
]


/**
 * Find absolute paths of version-specific installer packages recursively within a directory
 * @param {String} directory - Target directory
 * @param {String=} version - Package version
 * @returns {String[]} Absolute paths of found Installation packages
 */
let findInstallerSync = (directory, version) => {
    logger.debug('findInstallerSync')

    // Initialize globbing pattern Set
    const patternSet = new Set()

    // Generate installation files pattern
    const fileTitlePattern = version ? `*${version}*` : '*'
    const fileExtensionPattern = extensionList.join(',')

    // Add artifact files pattern
    patternSet.add(`**/${ fileTitlePattern }.{${ fileExtensionPattern }}`)

    // Add release metadata files pattern
    patternSet.add(`**/latest*.{json,yml}`)

    // Add exclusion pattern for ignored files (macOS)
    patternSet.add(`!mac/*.app/**/*`)

    // Add exclusion pattern for ignored files (Linux)
    patternSet.add(`!*-unpacked/**/*`)

    // Return found files
    return globby.sync([ ...patternSet ], { absolute: true, cwd: directory }) || []
}


/**
 * @exports
 */
module.exports = {
    findInstallerSync: findInstallerSync
}
