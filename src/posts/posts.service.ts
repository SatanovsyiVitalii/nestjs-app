import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import CreatePostDto from './dto/createPost.dto';
import Post from './post.entity';
import UpdatePostDto from './dto/updatePost.dto';

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepositiry: Repository<Post>,
  ) {}

  getAllPosts() {
    return this.postsRepositiry.find();
  }

  getPostById(id: number) {
    const post = this.postsRepositiry.findOne(id);
    if (post) {
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createPost(post: CreatePostDto) {
    const newPost = await this.postsRepositiry.create(post);
    await this.postsRepositiry.save(newPost);
    return newPost;
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postsRepositiry.update(id, post);
    const updatePost = await this.postsRepositiry.findOne(id);
    if (updatePost) {
      return updatePost;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async deletePost(id: number) {
    const deleteResource = await this.postsRepositiry.delete(id);
    if (!deleteResource.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
