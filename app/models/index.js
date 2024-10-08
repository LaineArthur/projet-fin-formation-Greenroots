import { Command } from './Command.js'
import { CommandHasTree } from './CommandHasTree.js'
import { Tree } from './Tree.js'
import { User } from './User.js'
import { UserHasTree } from './UserHasTree.js'
import { Variety } from './Variety.js'

//* User & Command

User.hasMany(Command, {
    as: 'commands',
    foreignKey: 'user_id',
});

Command.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id',
});

//* Variety & Tree

Variety.hasMany(Tree, {
    as: 'trees',
    foreignKey: 'variety_id',
  });

  Tree.belongsTo(Variety, {
      as: 'variety',
      foreignKey: 'variety_id',
  });

//* Command & Tree

Command.belongsToMany(Tree, {
    foreignKey: 'command_id',
    otherKey: 'tree_id',
    through: CommandHasTree,
    as: 'trees',
});

Tree.belongsToMany(Command, {
    foreignKey: 'tree_id',
    otherKey: 'command_id',
    through: CommandHasTree,
    as: 'commands',
});

//* User & Tree

User.belongsToMany(Tree, {
    foreignKey: 'user_id',
    otherKey: 'tree_id',
    through: UserHasTree,
    as : 'trees'
});

Tree.belongsToMany(User, {
    foreignKey: 'tree_id',
    otherKey: 'user_id',
    through: UserHasTree,
    as: 'users'
})


export { Command, CommandHasTree, UserHasTree, Tree, User, Variety};