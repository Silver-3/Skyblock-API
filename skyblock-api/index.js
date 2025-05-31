module.exports = class skyblockAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }
    /**
     * @typedef {Object} playerProfile Player profile object
     * @property {String} name Profile name
     * @property {String} id Profile id
     */

    /**
     * @typedef {Object} profileObject Profile data object
     * @property {Object} rift Rift data
     * @property {Object} player_data Player data 
     * @property {Object} events Player participated events
     * @property {Object} garden_player_data Garden data
     * @property {Object} glacite_player_data Glacite tunnels data
     * @property {Object} accessory_bag_storage Accessory bag data
     * @property {Object} leveling Leveling data
     * @property {Object} item_data Miscellaneous item data
     * @property {Object} jacobs_contest Jacobs contest stats
     * @property {Object} currencies Currency data
     * @property {Object} dungeons Dungeon data
     * @property {Object} profile Profile information
     * @property {Object} pets_data Pets data
     * @property {String} player_id Player ID of user
     * @property {Object} nether_island_player_data Crimson Isle data
     * @property {Object} experimentation Experimentation table results
     * @property {Object} mining_core Mining data
     * @property {Object} bestiary Bestiary information
     * @property {Object} quests Quests results
     * @property {Object} player_stats Player stats
     * @property {Object} forge Active forge items
     * @property {Object} fairy_soul Fairy soul stats
     * @property {Object} trophy_fish Trophy fishing data
     * @property {Object} objectives Objectives data
     * @property {Object} slayer Slayer stats
     * @property {Object} inventory Various inventory data
     * @property {Object} shared_inventory Shared inventory data
     * @property {Object} collection Current collection stats
     */

    /**
     * 
     * @param {String} username Username of player
     * @returns {String} Returns UUID
     */
    async getPlayerUUID(username) {
        const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        const data = await response.json();

        if (data.errorMessage) {
            return new Error('User not found');
        } else {
            return data.id;
        }
    }

    /**
     * 
     * @param {String} uuid UUID of player
     * @returns {String} Returns username
     */
    async getPlayerUsername(uuid) {
        const response = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
        const data = await response.json();

        if (data.errorMessage) {
            return new Error('User not found');
        } else {
            return data.name;
        }
    }

    /**
     * 
     * @param {String} username Username of player
     * @returns {Array<playerProfile>} Array of player profile objects
     */
    async getPlayerProfiles(username) {
        const uuid = await this.getPlayerUUID(username);
        const response = await fetch(`https://api.hypixel.net/v2/skyblock/profiles?key=${this.apiKey}&uuid=${uuid}`);
        const data = await response.json();

        if (typeof data == 'object' && data !== null && !Array.isArray(data)) {
            return data.profiles.map(profile => ({
                name: profile.cute_name,
                id: profile.profile_id
            }));
        } else {
            return new Error(`Something went wrong:\n${data}`);
        }
    }

    /**
     * 
     * @param {String} username Username of player
     * @param {String} profile Profile id
     * @returns {profileObject} Player stats
     */

    async getPlayerProfile(username, profile) {
        const uuid = await this.getPlayerUUID(username);
        const response = await fetch(`https://api.hypixel.net/v2/skyblock/profile?key=${this.apiKey}&profile=${profile}`);
        const data = await response.json();

        if (typeof data == 'object' && data !== null && !Array.isArray(data)) {
            return data.profile.members[uuid];
        } else {
            return new Error(`Something went wrong:\n${data}`);
        }
    }
}