import { Comments } from '../collections';
import { query } from '@bluelibs/nova';


const commentRaw = Comments.rawCollection();



const queries = {
  async comments(_, args, context, info) {

    let setfilters = {}
    let setOptions = {}

    if (args.text) setfilters.text = RegExp(args.text);
    if (args.limit) setOptions.limit = args.limit;
    if (args.skip) setOptions.skip = args.skip;

    return await query.graphql(commentRaw, info, {
      embody(body, args) {
        body.$ = {
          filters: setfilters,
          options: setOptions
        }
      }
    }).fetch();
  }
}


const resolvers = {
  Query: queries,
}

export default resolvers;