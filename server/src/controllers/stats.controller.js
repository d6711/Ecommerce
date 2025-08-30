const { Success } = require("../core/success.response");
const StatsService = require("../services/stats.service");

class StatsController {
    async getStats(req, res) {
        new Success({
            message: 'Get stats successfully',
            metadata: await StatsService.getStats()
        }).send(res)
    }
}

module.exports = new StatsController()