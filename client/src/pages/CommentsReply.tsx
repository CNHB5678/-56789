import { useState } from 'react';
import { Card, Button, List, Typography, Tag, Space, Avatar, Input, message, Badge, Tabs } from 'antd';
import { MessageSquare, ThumbsUp, CheckCircle, Send, Sparkles } from 'lucide-react';
import { useAppStore } from '../store';
import type { Comment } from '../types';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function CommentsReply() {
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [aiReply, setAiReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { comments, setComments } = useAppStore();

  // Mock comments data
  useState(() => {
    setComments([
      {
        id: '1',
        platform: '抖音',
        platformCommentId: 'dc1',
        author: '小明同学',
        text: '讲得太好了！学到很多，能多讲讲这个主题吗？',
        aiReply: '谢谢你的喜欢！我会继续分享更多相关内容的，记得关注哦～',
        status: 'replied',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: '2',
        platform: '小红书',
        platformCommentId: 'xh1',
        author: '爱生活的花花',
        text: '这个方法真的有用吗？想试试看',
        aiReply: '',
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: '3',
        platform: 'B站',
        platformCommentId: 'b1',
        author: '技术宅小王',
        text: '三连了！UP主讲得太清楚了',
        aiReply: '',
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
    ]);
  });

  const generateReply = async (comment: Comment) => {
    setReplyingTo(comment);
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const replies = [
        '谢谢你的喜欢！我会继续努力创作更好的内容～',
        '很高兴能帮到你！有其他问题也欢迎随时问我',
        '感谢支持！记得分享给需要的朋友哦',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setAiReply(randomReply);
    } catch (error) {
      message.error('生成回复失败');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendReply = (comment: Comment) => {
    message.success('回复已发送！');
    setReplyingTo(null);
    setAiReply('');
  };

  const pendingCount = comments.filter(c => c.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Title level={2} className="!mb-1">评论回复</Title>
          <Paragraph className="!text-gray-500 !mb-0">
            AI自动生成个性化回复，支持人工审核和修改
          </Paragraph>
        </div>
        <Button type="primary" icon={<Sparkles size={18} />} className="!bg-purple-600">
          自动回复全部
        </Button>
      </div>

      <Tabs
        defaultActiveKey="pending"
        items={[
          {
            key: 'pending',
            label: (
              <span>
                待回复 <Badge count={pendingCount} className="ml-2" />
              </span>
            ),
          },
          {
            key: 'approved',
            label: '已审核',
          },
          {
            key: 'replied',
            label: '已回复',
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comments List */}
        <div className="lg:col-span-2">
          <List
            dataSource={comments}
            renderItem={(comment) => (
              <List.Item className="mb-4">
                <Card hoverable className="w-full">
                  <div className="flex items-start gap-4">
                    <Avatar size={48} style={{ backgroundColor: comment.platform === '抖音' ? '#fe2c55' : comment.platform === '小红书' ? '#ff2442' : '#00a1d6' }}>
                      {comment.author[0]}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Text strong>{comment.author}</Text>
                          <Tag color={
                            comment.platform === '抖音' ? 'red' : 
                            comment.platform === '小红书' ? 'orange' : 'blue'
                          }>
                            {comment.platform}
                          </Tag>
                          {comment.status === 'replied' && (
                            <Tag icon={<CheckCircle size={12} />} color="green">已回复</Tag>
                          )}
                        </div>
                        <Text type="secondary" className="text-sm">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Text>
                      </div>

                      <Text className="text-gray-800 mb-3 block">{comment.text}</Text>

                      {comment.aiReply && (
                        <div className="bg-purple-50 rounded-lg p-4 mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={14} className="text-purple-600" />
                            <Text type="secondary" className="text-sm">AI 生成回复</Text>
                          </div>
                          <Text>{comment.aiReply}</Text>
                        </div>
                      )}

                      <div className="flex gap-2">
                        {comment.status === 'pending' && (
                          <>
                            <Button 
                              type="primary" 
                              size="small"
                              icon={<Sparkles size={14} />}
                              onClick={() => generateReply(comment)}
                              loading={isGenerating && replyingTo?.id === comment.id}
                              className="!bg-purple-600"
                            >
                              AI 生成回复
                            </Button>
                            <Button size="small" icon={<MessageSquare size={14} />}>
                              手动回复
                            </Button>
                          </>
                        )}
                        {comment.status === 'pending' && aiReply && replyingTo?.id === comment.id && (
                          <Button 
                            type="primary" 
                            size="small"
                            icon={<Send size={14} />}
                            onClick={() => sendReply(comment)}
                            className="!bg-green-600 ml-auto"
                          >
                            发送回复
                          </Button>
                        )}
                        {comment.status === 'replied' && (
                          <Button size="small" icon={<ThumbsUp size={14} />} disabled>
                            已回复
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>

        {/* Right Panel - Stats */}
        <div className="space-y-6">
          <Card title="回复统计" className="shadow-sm">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-600">今日待回复</span>
                <span className="text-2xl font-bold text-blue-600">{pendingCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-600">今日已回复</span>
                <span className="text-2xl font-bold text-green-600">12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-600">AI 回复率</span>
                <span className="text-2xl font-bold text-purple-600">85%</span>
              </div>
            </div>
          </Card>

          <Card title="平台账号" className="shadow-sm">
            <List
              dataSource={['抖音', '小红书', 'B站']}
              renderItem={(platform) => (
                <List.Item>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        platform === '抖音' ? 'bg-red-100' :
                        platform === '小红书' ? 'bg-orange-100' : 'bg-blue-100'
                      }`}>
                        <span className="text-xs font-bold">
                          {platform[0]}
                        </span>
                      </div>
                      <span>{platform}</span>
                    </div>
                    <Badge status="success" text="已连接" />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
