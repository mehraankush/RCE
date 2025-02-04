import TopicModel from '../../models/Topics.model.js';
import { catchHandler, errorHandler } from '../../utils/ErrorHandler.js';
import { successHandler } from '../../utils/sucessHandler.js';

const createSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export const getAlltopics = async (req, res) => {
    try {
        const newTopic = await TopicModel.find({});
        return successHandler(res, newTopic, "All Topics")
    } catch (error) {
        return catchHandler(error, res)
    }
};
export const createTopic = async (req, res) => {
    const { title, description, link } = req.body;

    try {
        const slug = createSlug(title);
        const newTopic = new TopicModel({ title, slug, description, link });
        await newTopic.save();

        return successHandler(res, newTopic, "Topic Created successfully")

    } catch (error) {
        return catchHandler(error, res)
    }
};


export const getTopicBySlug = async (req, res) => {
    const { slug } = req.params;

    try {
        const topic = await TopicModel.findOne({ slug });
        if (!topic) {
            return errorHandler(res, "Topic not found", 404)
        }

        return successHandler(res, topic, "Topic Found")
    } catch (error) {
        return catchHandler(error, res)
    }
};


export const updateTopicBySlug = async (req, res) => {
    const { slug } = req.params;
    const { title, description, link } = req.body;

    try {
        const topic = await TopicModel.findOne({ slug });
        if (!topic) {
            return errorHandler(res, "Topic not found", 404)
        }

        if (title) {
            topic.title = title;
            topic.slug = createSlug(title);
        }
        if (description) topic.description = description;
        if (link) topic.link = link;

        await topic.save();
        return successHandler(res, topic, "Topic Updated Successfully")
    } catch (error) {
        catchHandler(error, res)
    }
};

export const deleteTopicBySlug = async (req, res) => {
    const { slug } = req.params;

    try {
        const topic = await TopicModel.findOneAndDelete({ slug });
        if (!topic) {
            return errorHandler(res, "Topic not found", 404)
        }
        return successHandler(res, topic, "Topic deleted successfully")
    } catch (error) {
        return catchHandler(error, res)
    }
};
